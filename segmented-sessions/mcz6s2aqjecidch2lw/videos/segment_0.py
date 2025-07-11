from manim import *

class GraphTheoryAnimation(Scene):
    def construct(self):

        title = Text("Exploring Graph Theory", font_size=48)
        self.play(Write(title))
        self.wait(1)

        self.play(title.animate.shift(UP * 2))
        bridge_proble, m=Text("Königsberg Bridge Problem", font_size=36)
        self.play(Write(bridge_problem))
        self.wait(1)

        self.play(FadeOut(bridge_problem))
        graph_de, f=Text("What is a Graph?", font_size=36)
        self.play(Write(graph_def))
        self.wait(1)

        grap, h=Graph("A-B-C-D", layout="spring", vertex_config={"color": BLUE})
        self.play(Create(graph))
        self.wait(2)

        self.play(FadeOut(graph))
        paths_tex, t=Text("Paths & Connectivity", font_size=36)
        self.play(Write(paths_text))
        self.wait(1)

        connected_grap, h=Graph("A-B-C-D", layout="spring", vertex_config={"color": GREEN})
        self.play(Create(connected_graph))
        self.wait(2)

        self.play(FadeOut(connected_graph))
        eulerian_tex, t=Text("Eulerian Tours", font_size=36)
        self.play(Write(eulerian_text))
        self.wait(1)

        eulerian_grap, h=Graph("A-B-C-D", layout="spring", vertex_config={"color": YELLOW})
        self.play(Create(eulerian_graph))
        self.wait(2)

        self.play(FadeOut(eulerian_graph))
        planarity_tex, t=Text("Planarity", font_size=36)
        self.play(Write(planarity_text))
        self.wait(1)

        planar_grap, h=Graph("A-B-C-D-E", layout="spring", vertex_config={"color": RED})
        self.play(Create(planar_graph))
        self.wait(2)

        self.play(FadeOut(planar_graph))
        key_classes_tex, t=Text("Key Graph Classes: Trees & Hypercubes", font_size=36)
        self.play(Write(key_classes_text))
        self.wait(1)

        tre, e=Graph("A-B-C", layout="spring", vertex_config={"color": ORANGE})
        hypercub, e=Graph("A-B-C-D", layout="spring", vertex_config={"color": PURPLE})
        self.play(Create(tree))
        self.wait(1)
        self.play(FadeOut(tree), Create(hypercube))
        self.wait(1)

        self.play(FadeOut(hypercube), FadeOut(key_classes_text))
        self.play(FadeOut(title))
        self.wait(1)