from manim import *

class GraphAnimation(Scene):
    def construct(self):
        circle = Circle(radius=0.5)
        self.play(Create(circle))
        self.wait(1)

        vertex_a = Dot(color=BLUE).shift(LEFT)
        vertex_b = Dot(color=BLUE).shift(RIGHT)
        edge_undirected = Line(vertex_a.get_center(), vertex_b.get_center(), color=GREEN)

        self.play(Create(vertex_a), Create(vertex_b))
        self.play(Create(edge_undirected))
        label_v = Tex("V={A, B}").next_to(vertex_a, DOWN)
        label_e = Tex("E={A-B}").next_to(edge_undirected, UP)
        self.play(Write(label_v), Write(label_e))
        self.wait(2)

        self.play(FadeOut(label_v), FadeOut(label_e))
        vertex_c = Dot(color=RED).shift(LEFT * 2)
        vertex_d = Dot(color=RED).shift(RIGHT * 2)
        edge_directed = Arrow(vertex_c.get_center(), vertex_d.get_center(), color=YELLOW)

        self.play(Create(vertex_c), Create(vertex_d))
        self.play(Create(edge_directed))
        label_v_directed = Tex("V={C, D}").next_to(vertex_c, DOWN)
        label_e_directed = Tex("E={C \\to D}").next_to(edge_directed, UP)
        self.play(Write(label_v_directed), Write(label_e_directed))
        self.wait(2)

        self.play(FadeOut(label_v_directed), FadeOut(label_e_directed))
        social_vertex_a = Dot(color=BLUE).shift(LEFT * 3)
        social_vertex_b = Dot(color=BLUE).shift(RIGHT * 3)
        social_edge_directed = Arrow(social_vertex_a.get_center(), social_vertex_b.get_center(), color=YELLOW)
        social_edge_undirected = Line(social_vertex_a.get_center(), social_vertex_b.get_center(), color=GREEN)

        self.play(Create(social_vertex_a), Create(social_vertex_b))
        self.play(Create(social_edge_directed))
        self.wait(1)
        self.play(Transform(social_edge_directed, social_edge_undirected))
        self.wait(1)

        label_social = Tex("Alex \\to Bridget (Directed)").next_to(social_vertex_a, DOWN)
        label_social_undirected = Tex("Alex \\leftrightarrow Bridget (Undirected)").next_to(social_edge_undirected, UP)
        self.play(Write(label_social), Write(label_social_undirected))
        self.wait(2)

        self.play(FadeOut(social_vertex_a), FadeOut(social_vertex_b), FadeOut(label_social), FadeOut(label_social_undirected))
        self.wait(1)

        self.wait(30.6)